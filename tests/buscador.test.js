import test from 'node:test';
import assert from 'node:assert/strict';
import { Trie } from '../src/estructuras/Trie.js';
import { MaxHeap } from '../src/estructuras/MaxHeap.js';
import { Buscador, crearEjemplo, compararProductos } from '../src/buscador.js';
const nombres = productos => productos.map(p => p.name);

test('ejemplo exacto: searchTopK air 2 devuelve force 95 y max 90', () => {
  assert.deepEqual(crearEjemplo().searchTopK('air',2), [{name:'air force',popularity:95},{name:'air max',popularity:90}]);
});
test('Trie comparte prefijos y conserva palabras que terminan antes de sus hijos', () => {
  const t = new Trie(); for(const name of ['air','air max','adidas']) t.insertar({name,popularity:1});
  assert.equal(t.size,3); assert.deepEqual(new Set(nombres(t.buscarPrefijo('air'))),new Set(['air','air max']));
});
test('búsqueda por prefijo, no por fragmento interno', () => {
  const b=crearEjemplo(); assert.equal(b.searchTopK('max',2).length,0);
  assert.deepEqual(nombres(b.searchTopK('ad',2)),['adidas boost']);
});
test('normaliza mayúsculas, espacios externos y Unicode NFC', () => {
  const t=new Trie(); t.insertar({name:' Árbol ',popularity:2});
  assert.equal(t.buscarPrefijo(' A\u0301R ')[0].name,'Árbol');
  assert.throws(()=>t.insertar({name:'A\u0301RBOL',popularity:3}),/ya está/);
  assert.equal(t.buscarPrefijo('ar').length,0);
});
test('prefijo vacío devuelve todos los productos por popularidad', () => {
  assert.deepEqual(nombres(crearEjemplo().searchTopK(' ',10)),['air force','air max','air jordan','adidas boost']);
});
test('K mayor a coincidencias devuelve todas; K=1 devuelve máximo', () => {
  const b=crearEjemplo(); assert.equal(b.searchTopK('air',100).length,3);
  assert.deepEqual(nombres(b.searchTopK('air',1)),['air force']);
});
test('rechaza K inválido', () => {
  for (const k of [0,-1,101,1.2,NaN,'2',Infinity]) assert.throws(()=>crearEjemplo().searchTopK('air',k));
});
test('valida productos antes de modificar y rechaza duplicados', () => {
  const t=new Trie();
  for(const p of [null,{name:' ',popularity:1},{name:'x',popularity:-1},{name:'x',popularity:1.5},{name:'x',popularity:NaN},{name:'x',popularity:Number.MAX_SAFE_INTEGER+1}]) assert.throws(()=>t.insertar(p));
  assert.equal(t.size,0); t.insertar({name:'air',popularity:0});
  assert.throws(()=>t.insertar({name:' AIR ',popularity:9})); assert.equal(t.size,1);
});
test('recorrido muestra letras existentes y se detiene en la primera ausente', () => {
  const t=new Trie();t.insertar({name:'air',popularity:1});
  assert.deepEqual(t.recorrerPrefijo('azul'),[{letra:'a',existe:true},{letra:'z',existe:false}]);
  assert.deepEqual(t.recorrerPrefijo(''),[]);
});
test('Heap vacío y un elemento', () => {
  const h=new MaxHeap((a,b)=>a-b);assert.equal(h.peek(),null);assert.equal(h.extraerMaximo(),null);
  h.insertar(8);assert.equal(h.size,1);assert.equal(h.extraerMaximo(),8);assert.equal(h.size,0);
});
test('Heap construir, insertar y extraer mantienen prioridad', () => {
  const h=new MaxHeap((a,b)=>a-b,[4,1,9,3,7,2]);h.insertar(12);h.insertar(0);
  const resultado=[];while(h.size) resultado.push(h.extraerMaximo());
  assert.deepEqual(resultado,[12,9,7,4,3,2,1,0]);
});
test('cada padre tiene prioridad sobre ambos hijos en un Heap grande', () => {
  const numeros=Array.from({length:200},(_,i)=>(i*37)%211);const h=new MaxHeap((a,b)=>a-b,numeros);
  const validar=()=>{const valores=h.valores();for(let i=1;i<valores.length;i++)assert.ok(valores[Math.floor((i-1)/2)]>=valores[i]);};
  validar();for(let i=0;i<50;i++){h.extraerMaximo();validar();}h.insertar(999);validar();assert.equal(h.peek(),999);
});
test('empates tienen orden determinista por nombre normalizado', () => {
  const b=new Buscador();for(const name of ['air z','Air a','air m'])b.agregar({name,popularity:50});
  assert.deepEqual(nombres(b.searchTopK('air',3)),['Air a','air m','air z']);
});
test('buscar varias veces no consume ni modifica el catálogo', () => {
  const b=crearEjemplo();const primera=b.searchTopK('air',2);assert.deepEqual(b.searchTopK('air',2),primera);assert.equal(b.size,4);
  b.agregar({name:'air zoom',popularity:98});assert.equal(b.searchTopK('air',1)[0].name,'air zoom');assert.equal(b.size,5);
});
test('Heap inicial tiene todos los candidatos y raíz correcta antes de extraer', () => {
  const resultado=crearEjemplo().buscar('air',2);assert.equal(resultado.heapInicial.length,3);assert.equal(resultado.heapInicial[0].name,'air force');
  for(let i=1;i<resultado.heapInicial.length;i++)assert.ok(compararProductos(resultado.heapInicial[Math.floor((i-1)/2)],resultado.heapInicial[i])>=0);
});
test('copias de contenedores y productos inmutables protegen el catálogo', () => {
  const b=crearEjemplo();const datos=b.productos();datos.pop();assert.equal(b.size,4);
  assert.throws(()=>{datos[0].popularity=999;},TypeError);
  const entrada=[3,1,2];const h=new MaxHeap((a,b)=>a-b,entrada);entrada.push(999);h.valores().pop();assert.equal(h.size,3);
});
