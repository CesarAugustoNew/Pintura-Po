package com.delga.pinturapo.exception;

/** Exceção lançada para erros de regra de negócio / validação (HTTP 400). */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
