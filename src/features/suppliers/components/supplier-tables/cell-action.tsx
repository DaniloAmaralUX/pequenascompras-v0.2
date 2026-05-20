'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { deleteSupplierMutation } from '../../api/mutations';
import type { Supplier } from '../../api/types';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CellActionProps {
  data: Supplier;
}

export function CellAction({ data }: CellActionProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteMutation = useMutation({
    ...deleteSupplierMutation,
    onSuccess: () => {
      toast.success('Fornecedor removido com sucesso');
      setOpen(false);
    },
    onError: () => {
      toast.error('Falha ao remover fornecedor');
    }
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteMutation.mutate(data.id)}
        loading={deleteMutation.isPending}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className="relative h-8 w-8 p-0 before:absolute before:-inset-1 before:content-['']"
          >
            <span className='sr-only'>Abrir menu</span>
            <Icons.ellipsis className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/suppliers/${data.id}`)}>
            <Icons.edit className='mr-2 h-4 w-4' /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Icons.trash className='mr-2 h-4 w-4' /> Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
