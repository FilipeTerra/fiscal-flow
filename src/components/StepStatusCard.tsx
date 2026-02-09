import { useFiscal } from '@/contexts/FiscalContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export function StepStatusCard() {
  const { currentStep, steps } = useFiscal();
  const step = steps[currentStep];

  const statusConfig = {
    PENDENTE: {
      icon: Clock,
      className: 'bg-pending text-pending-foreground',
      label: 'Pendente',
    },
    APROVADO: {
      icon: CheckCircle2,
      className: 'bg-success text-success-foreground',
      label: 'Aprovado',
    },
    RECUSADO: {
      icon: XCircle,
      className: 'bg-destructive text-destructive-foreground',
      label: 'Recusado',
    },
  };

  const config = statusConfig[step.status];
  const Icon = config.icon;

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Etapa {currentStep + 1}: {step.label}
          </span>
        </div>
        <Badge className={`${config.className} gap-1.5 px-3 py-1`}>
          <Icon className="w-3.5 h-3.5" />
          {config.label}
        </Badge>
      </CardContent>
    </Card>
  );
}
