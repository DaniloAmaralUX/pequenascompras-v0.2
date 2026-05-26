'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import type { User } from '../api/types';
import { userByIdOptions } from '../api/queries';
import UserForm from './user-form';

type UserViewPageProps = {
  userId: string;
};

export default function UserViewPage({ userId }: UserViewPageProps) {
  if (userId === 'new') {
    return <UserForm initialData={null} pageTitle='Novo Usuário' />;
  }

  return <EditUserView userId={Number(userId)} />;
}

function EditUserView({ userId }: { userId: number }) {
  const { data } = useSuspenseQuery(userByIdOptions(userId));

  if (!data?.success || !data?.user) {
    notFound();
  }

  return <UserForm initialData={data.user as User} pageTitle='Editar Usuário' />;
}
