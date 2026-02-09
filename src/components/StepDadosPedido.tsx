import { useState } from 'react';
import { useFiscal } from '@/contexts/FiscalContext';
import { enviarSolicitacao } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { SolicitacaoBody } from '@/types/fiscal';

export function StepDadosPedido() {
  const { xmlData, updateStepStatus, setCurrentStep, setSolicitacaoId } = useFiscal();
  const [loading, setLoading] = useState(false);
  const [showDivergencia, setShowDivergencia] = useState(false);
  const [showEnviado, setShowEnviado] = useState(false);
  const [showSucesso, setShowSucesso] = useState(false);
  const [showErro, setShowErro] = useState(false);
  const [erros, setErros] = useState<string[]>([]);
  const [divergencias, setDivergencias] = useState<string[]>([]);

  const [form, setForm] = useState({
    origem: 'Pedidos',
    tipoProcesso: 'PagamentoNotaFiscal',
    valorTotal: xmlData?.valorTotal || 0,
    codigoPessoa: '',
    idContaBancaria: '',
    cpfBeneficiario: '',
    codigoEmissor: '',
    cnpjEmissor: xmlData?.cnpjCpfEmitente || '',
    codigoCnaeEmissor: xmlData?.codigoCNAE || '',
    codigoProjeto: '',
    subProjeto: 0,
    rubrica: '',
    contaRazao: '',
    centroDeCusto: '',
    numeroPedido: 0,
    justificativa: '',
  });

  const update = (field: string, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const checkDivergencias = (): string[] => {
    const divs: string[] = [];
    if (xmlData) {
      if (form.valorTotal !== xmlData.valorTotal) {
        divs.push(`Valor Total divergente: Formulário R$ ${form.valorTotal} ≠ XML R$ ${xmlData.valorTotal}`);
      }
      if (form.cnpjEmissor && form.cnpjEmissor !== xmlData.cnpjCpfEmitente) {
        divs.push(`CNPJ Emissor divergente: ${form.cnpjEmissor} ≠ ${xmlData.cnpjCpfEmitente}`);
      }
    }
    return divs;
  };

  const handleValidar = () => {
    const divs = checkDivergencias();
    if (divs.length > 0) {
      setDivergencias(divs);
      setShowDivergencia(true);
    } else {
      submitSolicitacao();
    }
  };

  const submitSolicitacao = async () => {
    setShowDivergencia(false);
    setShowEnviado(true);
    setLoading(true);

    try {
      const body: SolicitacaoBody = {
        ...form,
        documentosFiscais: [{
          tipoDocumento: 'NotaFiscal',
          idDocumentoFiscalExterno: xmlData?.id || '',
          chaveAcessoNf: xmlData?.chaveAcesso || '',
          dataEmissao: xmlData?.dataEmissao || '',
        }],
      };

      const response = await enviarSolicitacao(body);

      setShowEnviado(false);

      if (response.success) {
        setSolicitacaoId(response.data.id);
        updateStepStatus(2, 'APROVADO');
        setShowSucesso(true);
      } else {
        setErros(response.errors || [response.message]);
        updateStepStatus(1, 'RECUSADO', response.errors?.join(', ') || response.message);
        setShowErro(true);
      }
    } catch (err) {
      setShowEnviado(false);
      setErros(['Erro de conexão com o servidor']);
      setShowErro(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitarRevisao = () => {
    setShowDivergencia(false);
    setShowEnviado(true);
    setTimeout(() => {
      setShowEnviado(false);
    }, 2000);
  };

  return (
    <>
      <Card className="shadow-md border-none">
        <CardHeader>
          <CardTitle className="text-lg">Dados do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Beneficiário */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Beneficiário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="codigoPessoa">Código Pessoa</Label>
                <Input id="codigoPessoa" value={form.codigoPessoa} onChange={e => update('codigoPessoa', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="idContaBancaria">ID Conta Bancária</Label>
                <Input id="idContaBancaria" value={form.idContaBancaria} onChange={e => update('idContaBancaria', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cpfBeneficiario">CPF Beneficiário</Label>
                <Input id="cpfBeneficiario" value={form.cpfBeneficiario} onChange={e => update('cpfBeneficiario', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Emissor */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Emissor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="codigoEmissor">Código Emissor</Label>
                <Input id="codigoEmissor" value={form.codigoEmissor} onChange={e => update('codigoEmissor', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cnpjEmissor">CNPJ Emissor</Label>
                <Input id="cnpjEmissor" value={form.cnpjEmissor} onChange={e => update('cnpjEmissor', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="codigoCnaeEmissor">Código CNAE</Label>
                <Input id="codigoCnaeEmissor" value={form.codigoCnaeEmissor} onChange={e => update('codigoCnaeEmissor', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Dados Contábeis */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dados Contábeis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="codigoProjeto">Código Projeto</Label>
                <Input id="codigoProjeto" value={form.codigoProjeto} onChange={e => update('codigoProjeto', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subProjeto">Sub Projeto</Label>
                <Input id="subProjeto" type="number" value={form.subProjeto} onChange={e => update('subProjeto', Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rubrica">Rubrica</Label>
                <Input id="rubrica" value={form.rubrica} onChange={e => update('rubrica', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contaRazao">Conta Razão</Label>
                <Input id="contaRazao" value={form.contaRazao} onChange={e => update('contaRazao', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="centroDeCusto">Centro de Custo</Label>
                <Input id="centroDeCusto" value={form.centroDeCusto} onChange={e => update('centroDeCusto', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Pedido */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pedido</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="valorTotal">Valor Total</Label>
                <Input id="valorTotal" type="number" step="0.01" value={form.valorTotal} onChange={e => update('valorTotal', Number(e.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="numeroPedido">Número Pedido</Label>
                <Input id="numeroPedido" type="number" value={form.numeroPedido} onChange={e => update('numeroPedido', Number(e.target.value))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="justificativa">Justificativa</Label>
              <Textarea id="justificativa" rows={3} value={form.justificativa} onChange={e => update('justificativa', e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>Cancelar</Button>
          <Button onClick={handleValidar} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Validar Pedido
          </Button>
        </CardFooter>
      </Card>

      {/* Modal Divergências */}
      <Dialog open={showDivergencia} onOpenChange={setShowDivergencia}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Divergências Encontradas
            </DialogTitle>
            <DialogDescription>
              Foram encontradas divergências entre os dados preenchidos e o XML.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 my-4">
            {divergencias.map((d, i) => (
              <li key={i} className="text-sm bg-warning/10 text-warning rounded-lg p-3">
                {d}
              </li>
            ))}
          </ul>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDivergencia(false)}>
              Corrigir
            </Button>
            <Button onClick={handleSolicitarRevisao}>
              Solicitar Revisão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Enviado */}
      <Dialog open={showEnviado} onOpenChange={() => {}}>
        <DialogContent className="text-center sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-lg font-medium">Solicitação enviada</p>
            <p className="text-sm text-muted-foreground">Aguardando processamento...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Sucesso */}
      <Dialog open={showSucesso} onOpenChange={setShowSucesso}>
        <DialogContent className="text-center sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <p className="text-xl font-semibold">Validação Concluída</p>
            <p className="text-sm text-muted-foreground">Pedido enviado com sucesso!</p>
          </div>
          <DialogFooter>
            <Button className="w-full" onClick={() => { setShowSucesso(false); updateStepStatus(3, 'PENDENTE'); setCurrentStep(3); }}>
              Conferir Resultado da Solicitação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Erro */}
      <Dialog open={showErro} onOpenChange={setShowErro}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="w-5 h-5" />
              Erro na Validação
            </DialogTitle>
          </DialogHeader>
          <ul className="space-y-2 my-4">
            {erros.map((e, i) => (
              <li key={i} className="text-sm bg-destructive/10 text-destructive rounded-lg p-3">{e}</li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowErro(false); setCurrentStep(1); }}>
              Voltar aos Dados XML
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
