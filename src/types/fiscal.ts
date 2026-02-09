export interface XmlProcessResponse {
  success: boolean;
  data: XmlData;
  message: string;
  errors: string[];
  timestamp: string;
}

export interface XmlData {
  id: string;
  nomeArquivo: string;
  hash: string;
  tipoNota: string;
  chaveAcesso: string;
  numero: number;
  serie: number;
  modelo: string;
  dataEmissao: string;
  cnpjCpfEmitente: string;
  nomeEmitente: string;
  nomeFantasiaEmitente: string;
  inscricaoEstadualEmitente: string;
  ufEmitente: string;
  municipioEmitente: string;
  cnpjCpfDestinatario: string;
  nomeDestinatario: string;
  inscricaoEstadualDestinatario: string;
  ufDestinatario: string;
  municipioDestinatario: string;
  valorTotal: number;
  valorProdutos: number;
  valorServicos: number;
  baseCalculoICMS: number;
  valorICMS: number;
  baseCalculoICMSST: number;
  valorICMSST: number;
  valorIPI: number;
  valorPIS: number;
  valorCOFINS: number;
  valorII: number;
  valorISS: number;
  status: string;
  statusDescricao: string;
  tipoEmissao: string;
  quantidadeItens: number;
  informacoesFisco: string;
  finalidadeEmissao: string;
  tipoOperacao: string;
  naturezaOperacao: string;
  dataCompetencia: string;
  itemListaServicos: string;
  codigoCNAE: string;
  discriminacaoServico: string;
  codigoServicoMunicipio: string;
  municipioIncidencia: string;
  valorDeducoes: number;
  aliquotaISS: number;
  valorLiquido: number;
  retencaoFederal: boolean;
}

export interface SolicitacaoBody {
  origem: string;
  tipoProcesso: string;
  valorTotal: number;
  codigoPessoa: string;
  idContaBancaria: string;
  cpfBeneficiario: string;
  codigoEmissor: string;
  cnpjEmissor: string;
  codigoCnaeEmissor: string;
  codigoProjeto: string;
  subProjeto: number;
  rubrica: string;
  contaRazao: string;
  centroDeCusto: string;
  numeroPedido: number;
  justificativa: string;
  documentosFiscais: DocumentoFiscal[];
}

export interface DocumentoFiscal {
  tipoDocumento: string;
  idDocumentoFiscalExterno: string;
  chaveAcessoNf: string;
  dataEmissao: string;
}

export interface SolicitacaoResponse {
  success: boolean;
  data: {
    id: number;
    tipoProcesso: string;
    origem: string;
    valorTotal: number;
    numeroPedido: number;
  };
  message: string;
  errors: string[];
  timestamp: string;
}

export interface SolicitacaoDetailResponse {
  success: boolean;
  data: {
    id: number;
    origem: string;
    tipoProcesso: string;
    status: string;
    dataCriacao: string;
    valorTotal: number;
    numeroPedido: number;
    justificativa: string;
    erros: string;
    beneficiario: {
      codigoPessoa: string;
      idContaBancaria: string;
      cpfBeneficiario: string;
    };
    emissor: {
      codigoEmissor: string;
      cnpjEmissor: string;
      codigoCnaeEmissor: string;
    };
    dadosContabeis: {
      codigoProjeto: string;
      subProjeto: number;
      rubrica: string;
      contaRazao: string;
      centroDeCusto: string;
    };
    documentosFiscais: {
      id: number;
      tipoDocumento: string;
      idDocumentoFiscalExterno: string;
      chaveAcessoNf: string;
      dataEmissao: string;
    }[];
  };
  message: string;
  errors: string[];
  timestamp: string;
}

export type StepStatus = 'PENDENTE' | 'APROVADO' | 'RECUSADO';

export interface StepInfo {
  label: string;
  status: StepStatus;
  motivo?: string;
}
