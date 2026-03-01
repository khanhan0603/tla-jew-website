package com.tla_jew.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.tla_jew.dbo.request.AuthenticationRequest;
import com.tla_jew.dbo.request.IntrospectRequest;
import com.tla_jew.dbo.response.AuthenticationResponse;
import com.tla_jew.dbo.response.IntrospectResponse;
import com.tla_jew.entity.User;
import com.tla_jew.exception.AppException;
import com.tla_jew.exception.ErrorCode;
import com.tla_jew.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenticationService {
    UserRepository userRepository;

    @NonFinal
    @Value("${jwt.signedKey}")
    protected String SIGNED_KEY;

    public IntrospectResponse introspect(IntrospectRequest request)
            throws JOSEException, ParseException {
        var token=request.getToken();

        JWSVerifier verifier=new MACVerifier(SIGNED_KEY.getBytes());

        SignedJWT signedJWT=SignedJWT.parse(token);

        Date expityTime=signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified=signedJWT.verify(verifier);

        return IntrospectResponse.builder()
                .valid (verified && expityTime.after(new Date()))
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        var user=userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        PasswordEncoder passwordEncoder=new BCryptPasswordEncoder(10);

        boolean authenticated= passwordEncoder.matches(request.getPassword(), user.getPassword());
        if(!authenticated){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        var token=generateToken(user);

        var role=user.getRole();

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .role(role)
                .build();
    }

    //    Hàm generate token
    private String generateToken(User user){
        //Bước 1; build token
        JWSHeader header=new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet=new JWTClaimsSet.Builder()
                .subject(user.getId()) //Đại diện user đăng nhập
                .issuer("ka.com") //Xác định token issuer từ ai, thường là domain của mình
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                )) //Thời hạn token
                .claim("scope",buildScope(user))
                .build();

        //Tạo payload cho token
        Payload payload=new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject=new JWSObject(header,payload);

        //Bước 2: Ký token
        try {
            jwsObject.sign(new MACSigner(SIGNED_KEY.getBytes()));//Thuật toán MacSigner: thuật toán ký token mà khóa ký và khóa giải mã trùng nhau, thuật toán này cần chuỗi 32bit -> lấy bằng cách lên web Encryption key generator để lấy chuỗi ngẫu nhiên.
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token",e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user){
        StringJoiner stringJoiner=new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRole())){
            user.getRole().forEach(stringJoiner::add);
        }
        return stringJoiner.toString();
    }
}
