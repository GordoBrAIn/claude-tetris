---
description: Crea un git worktree aislado en .trees/[nombre] y ejecuta ahí las instrucciones recibidas
argument-hint: <instrucciones o requerimiento a ejecutar en el worktree>
---

Requerimiento del usuario: $ARGUMENTS

Sigue estos pasos en orden:

1. **Determina el nombre.** Basado en el requerimiento, elige un nombre corto en kebab-case, en minúsculas, sin espacios ni caracteres especiales (por ejemplo `agregar-modo-oscuro` o `fix-colision-paredes`).
2. **Crea el worktree** desde la raíz del repositorio:
   ```bash
   git worktree add .trees/[nombre]
   ```
   - Si `.trees/[nombre]` ya existe, agrega un sufijo numérico al nombre (`-2`, `-3`, ...).
   - Si `.trees/` no está en `.gitignore`, avisa al usuario. No lo modifiques sin pedirlo.
3. **Ejecuta el requerimiento dentro del worktree**, de forma independiente y aislada del código principal:
   - Trabaja únicamente con rutas dentro de `.trees/[nombre]/`. No edites archivos del árbol principal.
   - En comandos de shell usa `cd .trees/[nombre] && ...` o rutas absolutas hacia el worktree.
   - Si el requerimiento es amplio, puedes delegarlo a un subagente indicándole explícitamente la ruta absoluta del worktree como único directorio de trabajo.
4. **Reporta al terminar:** nombre del worktree, ruta, rama creada, resumen de los cambios y cómo integrarlos (`git merge` o PR). No hagas commit, push ni elimines el worktree a menos que el usuario lo pida.

Si `$ARGUMENTS` está vacío, pregunta al usuario qué instrucciones debes ejecutar en el worktree.
