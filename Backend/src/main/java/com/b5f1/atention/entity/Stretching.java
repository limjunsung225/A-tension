package com.b5f1.atention.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stretching {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stretching_id")
    private Long id;

    @Column
    private String name;

    @Column(nullable = false)
    private String url;

}
