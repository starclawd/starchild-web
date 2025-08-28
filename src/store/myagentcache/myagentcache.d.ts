export interface MyAgentCacheState {
  // 记录每个agent的最后访问时间戳，key为task_id，value为时间戳
  agentLastViewTimestamps: Record<string, number>
  isMenuNoAgentOpen: boolean
}
