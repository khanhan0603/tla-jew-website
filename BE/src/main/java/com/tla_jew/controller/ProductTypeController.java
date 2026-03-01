package com.tla_jew.controller;

import com.tla_jew.dbo.request.ProductTypeCreationRequest;
import com.tla_jew.dbo.request.ProductTypeUpdateRequest;
import com.tla_jew.dbo.response.ApiResponse;
import com.tla_jew.dbo.response.ProductTypeResponse;
import com.tla_jew.entity.ProductType;
import com.tla_jew.service.ProductTypeService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/types")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductTypeController {
    ProductTypeService productTypeService;

    @PostMapping
    ApiResponse<ProductType> createProductType(@RequestBody @Valid ProductTypeCreationRequest request){
        ApiResponse<ProductType> apiResponse=new ApiResponse<>();

        apiResponse.setResult(productTypeService.createProductType(request));

        return apiResponse;
    }

    @GetMapping
    List<ProductType> getTypes(){
        return productTypeService.getTypes();
    }

    @GetMapping("/{typeId}")
    ProductTypeResponse getType(@PathVariable("typeId")String typeId){
        return productTypeService.getType(typeId);
    }

    @PutMapping("/{typeId}")
    ProductTypeResponse updateProductType (@PathVariable String typeId, @RequestBody ProductTypeUpdateRequest request){
        return productTypeService.updateProductType(typeId,request);
    }

    @DeleteMapping("/{typeId}")
    String deleteType(@PathVariable String typeId){
        productTypeService.deleteProductType(typeId);
        return "Loại sản phẩm đã được xóa";
    }
}
