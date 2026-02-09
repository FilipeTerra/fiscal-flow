import { useState } from 'react';
import { useFiscal } from '@/contexts/FiscalContext';
import { consultarSolicitacao } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import type { SolicitacaoDetailResponse } from '@/types/fiscal';

export function StepResultado() {
  const { solicitacaoId, updateStepStatus, resetAll } = useFiscal();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SolicitacaoDetailResponse | null>(null);
  const [error, setError] = useState('');

  const consultar = async () => {
    if (!solicitacaoId) return;
    setLoading(true);
    setError('');
    try {
      const data = await consultarSolicitacao(solicitacaoId);
      setResult(data);
      if (data.success && data.data.status !== 'Erro') {
        updateStepStatus(3, 'APROVADO');
      } else {
        updateStepStatus(3, 'RECUSADO', data.data?.erros || data.errors?.join(', '));
      }
    } catch {
      setError('Não foi possível consultar a solicitação.');
    } finally {
      setLoading(false);
    }
  };

  const isError = result && (!result.success || result.data?.status === 'Erro');

  return (
    <div className="space-y-4">
      {!result ? (
        <Card className="shadow-md border-none">
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <p className="text-xl font-semibold">Pedido enviado com sucesso</p>
            <p className="text-sm text-muted-foreground">ID da solicitação: {solicitacaoId}</p>
            <Button onClick={consultar} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Conferir Resultado da Solicitação
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>
      ) : isError ? (
        <Card className="shadow-md border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive text-lg">
              <XCircle className="w-5 h-5" />
              Erros na Solicitação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge className="bg-destructive text-destructive-foreground">Status: {result.data?.status}</Badge>
            {result.data?.erros && (
              <div className="bg-destructive/5 rounded-lg p-4">
                <p className="text-sm text-destructive whitespace-pre-wrap">{result.data.erros}</p>
              </div>
            )}
            {result.errors?.length > 0 && (
              <ul className="space-y-1">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-sm text-destructive bg-destructive/5 rounded p-2">{e}</li>
                ))}
              </ul>
            )}
            <Button variant="outline" onClick={resetAll} className="gap-2 mt-4">
              <ArrowLeft className="w-4 h-4" /> Recomeçar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md border-none">
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <p className="text-xl font-semibold">Solicitação Aprovada</p>
            <Badge className="bg-success text-success-foreground">Status: {result.data.status}</Badge>
            <div className="text-sm text-muted-foreground space-y-1 text-center">
              <p>Pedido #{result.data.numeroPedido}</p>
              <p>Valor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.data.valorTotal)}</p>
              <p>Criado em: {new Date(result.data.dataCriacao).toLocaleDateString('pt-BR')}</p>
            </div>
            <Button onClick={resetAll} className="gap-2 mt-4">
              <ArrowLeft className="w-4 h-4" /> Nova Solicitação
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
