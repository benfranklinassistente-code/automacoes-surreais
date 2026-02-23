# YouTube Channel Videos

Listar vídeos de um canal do YouTube.

## Uso

```
listar vídeos do canal: https://youtube.com/@nome-do-canal
```

## Dependências

- `yt-dlp` instalado

## Comando

```bash
yt-dlp --flat-playlist --print "%(title)s | %(url)s" "URL_DO_CANAL/videos" 2>/dev/null
```

## Exemplos

- `listar vídeos do canal: https://youtube.com/@aiprogbr`
- `mostrar vídeos de: https://youtube.com/@canal`

## Opções

- `--limit N` - Limitar a N vídeos
- `--json` - Retornar em formato JSON
