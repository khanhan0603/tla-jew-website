package com.tla_jew.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String proId;

    String proName;
    Integer proCount;
    Double proCost;
    String proDetail;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    byte[] proImg;

    @ManyToOne
    @JoinColumn(name = "type_id") // cột khóa ngoại
    ProductType productType;
}
