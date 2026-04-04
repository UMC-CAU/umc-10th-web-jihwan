// src/router/types.ts
import React from 'react';

export interface RouteProps {
  path: string;
  component: React.ComponentType;
}

export interface LinkProps {
  to: string;
  children: React.ReactNode;
}

// types.ts에 추가
export interface RoutesProps {
  children: React.ReactNode;
}