export interface YearConfig {
    label: string;
    value: number;
    json: string;
}

export interface KDDetail {
    before: number;
    added: number;
    after: number;
}

export interface UpdateRow {
    player: string;
    team: string;
    kill: KDDetail;
    death: KDDetail;
    maps: number;
}

export interface RankItem {
    rank: number;
    player: string;
    team: string;
    kill: number;
    death: number;
    maps: number;
    k_dDiff: number;
}

export interface ReportMatch {
    title: string;
    date: string;
}

export interface Rankings {
    warriors: RankItem[];
    victims: RankItem[];
}

export interface ReportData {
    match: ReportMatch;
    updates: UpdateRow[];
    rankings: Rankings;
    loading?: boolean;
}
