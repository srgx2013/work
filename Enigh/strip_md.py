#!/usr/bin/env python3
"""Limpia markdown a texto plano para TTS."""
import re
import sys

def strip_md(text: str) -> str:
    # frontmatter
    text = re.sub(r'^---.*?^---\s*', '', text, count=1, flags=re.DOTALL | re.MULTILINE)
    # imágenes
    text = re.sub(r'!\[.*?\]\(.*?\)', '', text)
    # enlaces -> solo texto
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    # bloques de código
    text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
    # inline code
    text = re.sub(r'`[^`]+`', '', text)
    # headers
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    # bold/italic
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    # tablas (líneas que empiezan con |)
    text = re.sub(r'^\|.*$', '', text, flags=re.MULTILINE)
    # separadores de tablas (solo |, -, +)
    text = re.sub(r'^[|+\- ]+$', '', text, flags=re.MULTILINE)
    # blockquotes
    text = re.sub(r'^>\s?', '', text, flags=re.MULTILINE)
    # listas (guiones/asteriscos al inicio de línea)
    text = re.sub(r'^[\s]*[-*+]\s+', '', text, flags=re.MULTILINE)
    # listas numeradas
    text = re.sub(r'^\s*\d+[.)]\s+', '', text, flags=re.MULTILINE)
    # líneas vacías -> un solo espacio
    text = re.sub(r'\n\s*\n', '\n', text)
    # múltiples espacios
    text = re.sub(r' +', ' ', text)
    # trim
    text = text.strip()
    return text

if __name__ == '__main__':
    content = sys.stdin.read()
    cleaned = strip_md(content)
    print(cleaned)
