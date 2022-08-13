import script from './script.json'

type KeyOfScriptContent = keyof typeof script['content']

type Replacers = Array<{ key: string; value: string }>

type ParsedScriptConfig = {
  playerName: string
  marketName: string
}

export type Script = typeof script

export const getParsedScript = (config: ParsedScriptConfig): Script => {
  const { playerName, marketName } = config

  const replacers: Replacers = [
    //@ - имя игрока
    { key: '@', value: playerName },
    //# - название магазина
    { key: '#', value: marketName },
  ]

  const parsedScript = { ...script }
  for (var key in parsedScript.content) {
    replacers.forEach((replacer) => {
      parsedScript.content[key as KeyOfScriptContent] = parsedScript.content[key as KeyOfScriptContent]
        .split(replacer.key)
        .join(replacer.value)
    })
  }

  return parsedScript
}
