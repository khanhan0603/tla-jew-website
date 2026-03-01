package com.tla_jew.dbo.request;

import com.tla_jew.entity.ProductType;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreationRequest {
    String proName;
    Integer proCount;
    Double proCost;
    String proDetail;
    byte[] proImg;
    String typeId;
}
