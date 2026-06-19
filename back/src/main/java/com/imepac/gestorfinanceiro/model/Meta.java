package com.imepac.gestorfinanceiro.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "metas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Meta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome; // Ex: "Casamento", "Viagem para Disney"

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorObjetivo; // Quanto precisam juntar

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorAtual = BigDecimal.ZERO; // Quanto já têm

    @Column(nullable = false)
    private LocalDate dataLimite;

    // A mágica acontece aqui: A tabela de ligação automática!
    @ManyToMany
    @JoinTable(
            name = "meta_usuario",
            joinColumns = @JoinColumn(name = "meta_id"),
            inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<Usuario> usuarios = new HashSet<>();
}