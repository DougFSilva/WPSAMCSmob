export interface Solicitacao {
    id: number,
    alunoId: number,
    dataSolicitacao: string,
    dataConclusao: string,
    turma:string,
    aluno:string,
    descricao: string,
    status: boolean
}