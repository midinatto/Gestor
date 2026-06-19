package com.imepac.gestorfinanceiro.repository;

import com.imepac.gestorfinanceiro.model.Meta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetaRepository extends JpaRepository<Meta, Long> {

    // Busca todas as metas que têm esse ID de usuário na lista
    List<Meta> findByUsuarios_Id(Long usuarioId);
}