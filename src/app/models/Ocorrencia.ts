export interface Ocorrencia {
    id: number,
    privado: boolean,
    data: Date,
    tipo: string,
    registrador: string,
    aluno: string,
    descricao: string,
    bloqueio: boolean
}