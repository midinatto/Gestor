package com.imepac.gestorfinanceiro.repository;

import com.imepac.gestorfinanceiro.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}