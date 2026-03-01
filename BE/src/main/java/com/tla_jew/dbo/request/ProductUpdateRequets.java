package com.tla_jew.dbo.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductUpdateRequets {
    String proName;
    Integer proCount;
    Double proCost;
    String proDetail;
    String typeId;
    MultipartFile file;
}
