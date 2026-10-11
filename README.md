# Challenges de Estructuras de Datos II

**Harold Camilo Villota Ortiz · Código 2240680**

Los **7 challenges de las clases suministradas están implementados** en JavaScript con interfaz React. Cada ejercicio está en su propia rama, dentro de este único repositorio. `main` contiene el índice; el código de cada aplicación se consulta en su rama.

## Índice de ejercicios

| Challenge | Tema y aplicación | Abrir entrega | Pruebas |
| --- | --- | --- | --- |
| 03 | Lista simple de canciones y lista doble de páginas visitadas | [Rama de listas](https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-03-listas) | 10 aprobadas |
| 04 | Pila de libros con formulario | [Rama de pilas](https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-04-pilas) | 10 aprobadas |
| 05 | Cola de personas en un cajero por fecha de llegada | [Rama de colas](https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-05-colas) | 12 aprobadas |
| 08 | Árbol binario, búsqueda y recorridos con react-d3-tree | [Rama de árbol binario](https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-08-arbol-binario) | 12 aprobadas |
| 09 | Árbol n-ario de menús y submenús | [Rama de árbol n-ario](https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-09-arbol-nario) | 12 aprobadas |
| 10 | Grafo de personas y ciudades con react-d3-graph | [Rama de grafos](https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-10-grafos) | 12 aprobadas |
| 11 | Buscador de productos con Trie y Max Heap para Top K | [Rama de Trie y Heap](https://github.com/camilovillota16-stack/Challeng-de-cada-clase/tree/codex/challenge-11-trie-heap) | 16 aprobadas |

Los números corresponden a las consignas de las presentaciones entregadas; no son una numeración consecutiva de las ramas.

Material revisado: **Clase 03 - Listas.pptx**, **Clase 06 - Pilas y Colas.pptx**, **Clase 09 - Árboles.pptx**, **Clase 10 - Grafos.pptx** y **Clase 11 - Tries_n_Heaps.pptx**.

Cada entrega incluye código, datos de ejemplo, pruebas, README con la explicación de su estructura y `PRUEBAS.md` con las verificaciones realizadas.

## Cómo revisar un ejercicio

En GitHub, pulsa un enlace de la tabla o abre el selector que muestra `main` y selecciona la rama. Allí encontrarás su código y las instrucciones para ejecutarlo. Los ejercicios permanecen separados; no necesitas combinarlos en `main`.

En tu computador necesitas Git y Node.js 22.12 o superior. Desde PowerShell:

```powershell
git clone https://github.com/camilovillota16-stack/Challeng-de-cada-clase.git
cd Challeng-de-cada-clase
git switch codex/challenge-03-listas
npm.cmd ci
npm.cmd run dev
```

Si el repositorio ya está descargado, entra a su carpeta y omite `git clone`. Abre [http://127.0.0.1:5173/](http://127.0.0.1:5173/).

Para cambiar de ejercicio:

1. Detén el servidor con `Ctrl + C` en su terminal.
2. Cambia de rama, por ejemplo `git switch codex/challenge-11-trie-heap`.
3. Ejecuta `npm.cmd ci` para instalar las dependencias de esa rama.
4. Ejecuta `npm.cmd run dev` y recarga la página.

Challenge10 utiliza React 16 y D3 5 para respetar los requisitos de react-d3-graph; los demás usan React 19. Por eso es necesario instalar las dependencias después de cambiar de rama. Cada rama tiene su propio `package-lock.json`.

Para volver a encender el ejercicio otro día, abre la terminal en la carpeta del repositorio y ejecuta `npm.cmd run dev`. El servidor debe permanecer encendido mientras uses la página. Los ejercicios trabajan con ejemplos en memoria; recargar reinicia sus datos.

## Verificación de entrega

El **10 de octubre de 2026** se ejecutaron nuevamente las pruebas de las siete ramas: **84 aprobadas, 0 fallidas**. Las pruebas de las estructuras usan el ejecutor integrado de Node.js.

Cada aplicación también se compiló y se revisó en el navegador al completar su implementación. Los resultados y escenarios concretos están documentados en `PRUEBAS.md` de cada rama. Esta revisión final del índice repitió las pruebas de las estructuras; no repitió todas las instalaciones, compilaciones ni sesiones de navegador anteriores.

Para comprobar una rama por tu cuenta, después de instalar sus dependencias:

```powershell
npm.cmd test
npm.cmd run build
```

## Para presentar al profesor

Entrega el enlace de este repositorio: [Challeng-de-cada-clase](https://github.com/camilovillota16-stack/Challeng-de-cada-clase). Desde esta página se accede a los siete ejercicios, cada uno en su rama. Su README contiene un ejemplo de demostración y explica qué hace la estructura, cómo se conecta con la interfaz y sus costos principales.
