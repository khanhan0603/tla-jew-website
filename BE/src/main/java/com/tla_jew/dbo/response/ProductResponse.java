package com.tla_jew.dbo.response;

import com.tla_jew.entity.ProductType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data //Tự tạo getter, setter, đồng thời có thêm các phương thức khác như toString...
@NoArgsConstructor
@AllArgsConstructor
@Builder //builder class cho 1 cái dbo
@FieldDefaults(level = AccessLevel.PRIVATE)//mặc định các biến là private
public class ProductResponse {
    String proId;

    String proName;
    Integer proCount;
    Double proCost;
    String proDetail;
    byte[] proImg;
    ProductType productType;
}
