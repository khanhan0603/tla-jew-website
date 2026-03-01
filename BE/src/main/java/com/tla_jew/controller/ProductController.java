package com.tla_jew.controller;

import com.tla_jew.dbo.request.ProductUpdateRequets;
import com.tla_jew.dbo.response.ApiResponse;
import com.tla_jew.dbo.response.ProductResponse;
import com.tla_jew.entity.Product;
import com.tla_jew.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/pro")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ProductController {
    ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Product> createProduct(
            @RequestParam String proName,
            @RequestParam Integer proCount,
            @RequestParam Double proCost,
            @RequestParam String proDetail,
            @RequestParam String typeId,
            @RequestParam MultipartFile file
    ) throws IOException {

//        System.out.println("proName=" + proName);
//        System.out.println("proCost=" + proCost);
//        System.out.println("proCount=" + proCount);
//        System.out.println("typeId=" + typeId);
//        System.out.println("file=" + (file != null));

        Product product = productService.createProduct(
                proName, proCount, proCost, proDetail, typeId, file
        );

        ApiResponse<Product> response = new ApiResponse<>();
        response.setResult(product);

        return response;
    }

    @GetMapping
    List<Product> getPros(){
        return productService.getLists();
    }

    @GetMapping("/{proId}")
    ProductResponse getPro(@PathVariable("proId")String proId){
        return productService.getProduct(proId);
    }

    @GetMapping("/type/{typeId}")
    List<ProductResponse> getProByTypeId(@PathVariable("typeId") String typeId){
        return productService.getProductsByProductType_TypeId(typeId);
    }

    @PutMapping(value = "/{proId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponse updateProduct(
            @PathVariable String proId,
            @ModelAttribute ProductUpdateRequets request
    ) throws IOException {

        return productService.updateProduct(proId, request);
    }

    @DeleteMapping("/{proId}")
    String deleteProduct(@PathVariable String proId){
        productService.deleteProduct(proId);
        return "Sản phẩm đã được xóa";
    }

    @GetMapping("/search")
    public ApiResponse<Page<ProductResponse>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        Page<ProductResponse> result =
                productService.searchByName(keyword, page, size);

        return ApiResponse.<Page<ProductResponse>>builder()
                .result(result)
                .build();
    }
}
