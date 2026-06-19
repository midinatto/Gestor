package com.imepac.gestorfinanceiro.repository;

import com.imepac.gestorfinanceiro.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    // O Spring monta a query SQL sozinho só de ler esse nome!
    List<Transacao> findByUsuarioId(Long usuarioId);
}