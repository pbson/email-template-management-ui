import { createQueryKeys } from '@lukemorales/query-key-factory';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import caseApi from '../services/case.api';
import { QueryOptions } from '@/ts/types';

const cases = createQueryKeys('cases', {
  list: (params: any = {}) => ({
    queryKey: ['cases', params],
    queryFn: (params: any) => caseApi.getList(params),
  }),
  detail: (id: number) => ({
    queryKey: ['cases', id],
    queryFn: () => caseApi.getDetail(id),
  }),
});

export const useCaseListQuery = (params: any = {}) => {
  return useQuery({
    ...cases.list(params),
    onError: () => {
      toast.error('Failed to fetch cases');
    },
  });
};

export const useCaseDetailQuery = (
  id: number,
  options: QueryOptions<any> = {},
) => {
  return useQuery({
    ...cases.detail(id),
    ...options,
  });
};

export const useCreateCaseMutation = () => {
  return useMutation({
    mutationFn: caseApi.add,
    onSuccess: () => {
      void toast.success('Create new Case successfully');
    },
    onError: () => {
      void toast.error('Create new Case failed');
    },
  });
};

export const useUpdateCaseMutation = () => {
  return useMutation({
    mutationFn: caseApi.update,
    onSuccess: () => {
      void toast.success('Update Case successfully');
    },
    onError: () => {
      void toast.error('Update Case failed');
    },
  });
};

export const useDeleteCaseMutation = () => {
  return useMutation({
    mutationFn: caseApi.delete,
    onSuccess: () => {
      void toast.success('Delete Case successfully');
    },
    onError: () => {
      void toast.error('Delete Case failed');
    },
  });
};
