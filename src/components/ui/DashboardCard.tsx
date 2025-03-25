
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
  onClick?: () => void;
}

export default function DashboardCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
  onClick
}: DashboardCardProps) {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl p-6 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md transform hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        
        {trend && (
          <div 
            className={cn(
              "flex items-center px-2 py-1 rounded-full text-xs font-medium",
              trend.direction === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            )}
          >
            <span>{trend.direction === 'up' ? '+' : '-'}{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
