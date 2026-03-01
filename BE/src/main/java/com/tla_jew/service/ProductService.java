package com.tla_jew.service;

import com.tla_jew.dbo.request.ProductCreationRequest;
import com.tla_jew.dbo.request.ProductTypeUpdateRequest;
import com.tla_jew.dbo.request.ProductUpdateRequets;
import com.tla_jew.dbo.response.ProductResponse;
import com.tla_jew.dbo.response.ProductTypeResponse;
import com.tla_jew.entity.Product;
import com.tla_jew.entity.ProductType;
import com.tla_jew.mapper.ProductMapper;
import com.tla_jew.repository.ProductRepository;
import com.tla_jew.repository.ProductTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    ProductTypeRepository productTypeRepository;
    ProductMapper productMapper;

    public Product createProduct(
            String proName,
            Integer proCount,
            Double proCost,
            String proDetail,
            String typeId,
            MultipartFile file
    ) throws IOException {

        ProductType productType = productTypeRepository.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại sản phẩm"));

        Product product = Product.builder()
                .proName(proName)
                .proCount(proCount)
                .proCost(proCost)
                .proDetail(proDetail)
                .productType(productType)
                .proImg(file != null && !file.isEmpty() ? file.getBytes() : null)
                .build();



        return productRepository.save(product);
    }

    public List<Product> getLists(){
        return productRepository.findAll();
    }

    public ProductResponse getProduct(String proId){
        return productMapper.toProductResponse(productRepository.findByProId(proId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!")));
    }

    public List<ProductResponse> getProductsByProductType_TypeId(String typeId){
        List<Product> products = productRepository.getProductsByProductType_TypeId(typeId);
        return products.stream()
                .map(productMapper::toProductResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse updateProduct(String proId, ProductUpdateRequets request) throws IOException {
        Product product = productRepository.findById(proId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        ProductType type = productTypeRepository.findById(request.getTypeId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại sản phẩm"));

        product.setProName(request.getProName());
        product.setProCount(request.getProCount());
        product.setProCost(request.getProCost());
        product.setProDetail(request.getProDetail());
        product.setProductType(type);

        //nếu có file mới thì cập nhật
        if (request.getFile() != null && !request.getFile().isEmpty()) {
            product.setProImg(request.getFile().getBytes());
        }

        return productMapper.toProductResponse(productRepository.save(product));
    }

    public void deleteProduct(String proId){
        productRepository.deleteById(proId);
    }

    public Page<ProductResponse> searchByName(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository
                .findByProNameContainingIgnoreCase(keyword, pageable)
                .map(productMapper::toProductResponse);
    }
}
