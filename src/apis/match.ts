import httpInstance from './httpInstance'

export interface Team {
    id: number
    matchesId: number
    teamName: string
    teamImgUrl: string
}

export interface ApiTeam {
    id: number
    team_name: string
    team_img_url: string
}

export interface PredictionRecord {
    id: number
    userId: number
    matchesId: number
    s_l: string
    l_s: string
    advance: string
    createTime: string
    updateTime: string
}

export interface SubmitPredictionParams {
    matchId: number
    phase: string
    s_l: string
    l_s: string
    advance: number[]
}

// 赛事相关API
export const matchAPI = {
    // 获取赛事队伍池
    getMatchTeams(matchId: number,phase: string) {
        return httpInstance.get<ApiTeam[]>(`/machine/matches/${matchId}/teams`, {
            params: {
                phase: phase
            }
        })
    },

    // 提交预测
    submitPrediction(params: SubmitPredictionParams) {
        return httpInstance.post('/machine/prediction/submit', params)
    },

    // 获取用户预测记录
    getUserPredictions(params: { userId: number, matchId: number, phase: string }) {
        return httpInstance.get<PredictionRecord[]>('/machine/prediction/records', {
            params: {
                matchId: params.matchId,
                phase: params.phase
            }
        })
    }
}