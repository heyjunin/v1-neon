"use client";

import { useOrganization } from "@/contexts/organization-context";

/**
 * Hook para obter a organization atual em qualquer parte da aplicação
 * 
 * @returns {Object} Objeto contendo a organization atual e funções relacionadas
 * @returns {Object} currentOrganization - A organization atual (pode ser null)
 * @returns {Array} userOrganizations - Lista de todas as organizations do usuário
 * @returns {boolean} isLoading - Se está carregando
 * @returns {string|null} error - Erro se houver
 * @returns {Function} setCurrentOrganization - Função para definir a organization atual
 * @returns {Function} refreshOrganizations - Função para atualizar a lista de organizations
 * @returns {boolean} hasOrganizations - Se o usuário tem organizations
 * @returns {boolean} isOwner - Se o usuário é owner da organization atual
 * @returns {boolean} isAdmin - Se o usuário é admin da organization atual
 * @returns {boolean} isMember - Se o usuário é member da organization atual
 */
export function useCurrentOrganization() {
  const {
    currentOrganization,
    userOrganizations,
    isLoading,
    error,
    setCurrentOrganization,
    refreshOrganizations,
  } = useOrganization();

  const hasOrganizations = userOrganizations.length > 0;
  
  const isOwner = currentOrganization?.role === "owner";
  const isAdmin = currentOrganization?.role === "admin";
  const isMember = currentOrganization?.role === "member";

  return {
    currentOrganization,
    userOrganizations,
    isLoading,
    error,
    setCurrentOrganization,
    refreshOrganizations,
    hasOrganizations,
    isOwner,
    isAdmin,
    isMember,
  };
}
