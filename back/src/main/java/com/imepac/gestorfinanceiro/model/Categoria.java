package com.imepac.gestorfinanceiro.model;

import com.imepac.gestorfinanceiro.model.enums.TipoCategoria;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nome;

    // Essa anotação salva a palavra "RECEITA" ou "DESPESA" no banco em vez de números (0 ou 1)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private TipoCategoria tipo;
}