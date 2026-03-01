package com.tla_jew.service;

import com.tla_jew.dbo.request.ProductTypeCreationRequest;
import com.tla_jew.dbo.request.ProductTypeUpdateRequest;
import com.tla_jew.dbo.response.ProductTypeResponse;
import com.tla_jew.entity.ProductType;
import com.tla_jew.exception.AppException;
import com.tla_jew.exception.ErrorCode;
import com.tla_jew.mapper.ProductTypeMapper;
import com.tla_jew.repository.ProductTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductTypeService {
    ProductTypeRepository productTypeRespository;
    ProductTypeMapper productTypeMapper;

    public ProductType createProductType(ProductTypeCreationRequest request){
        if(productTypeRespository.existsByTypeName(request.getTypeName()))
            throw  new AppException(ErrorCode.TYPE_NAME_EXISTED);

        ProductType type=productTypeMapper.toType(request);

        return productTypeRespository.save(type);
    }

    public List<ProductType>getTypes(){
        return productTypeRespository.findAll();
    }

    public ProductTypeResponse getType(String typeId){
        return productTypeMapper.toProductTypeResponse(productTypeRespository.findByTypeId(typeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại sản phẩm!")));
    }

    public ProductTypeResponse updateProductType(String typeId, ProductTypeUpdateRequest request){
        ProductType p=productTypeRespository.findByTypeId(typeId).orElseThrow(() -> new RuntimeException("Không tìm thấy loại sản phẩm"));

        productTypeMapper.updateTypeName(p,request);

        return productTypeMapper.toProductTypeResponse(productTypeRespository.save(p));
    }

    public void deleteProductType(String typeId){
        productTypeRespository.deleteById(typeId);
    }
}
