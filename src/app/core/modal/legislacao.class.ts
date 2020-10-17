import { Artigo } from './artigo.class';

export class Legislacao {
  id: number;
  legislacao: string;
  exigeDataInicio: boolean;
  artigos: Artigo[] = [];
}
