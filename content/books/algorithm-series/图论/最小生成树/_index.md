
---
title: 最小生成树
linktitle: 最小生成树
type: book
commentable: true
---

﻿# 最大权和生成树

一个有 n 个结点的连通图的生成树是原图的最小连通子图，且包含原图中所有 n 个结点，并且有保持图联通的最少的
边。最大生成树就是权和最大生成树，现在给出一个无向带权图的邻接矩阵，权为 0 表示没有边。｛{0，4，5，0，3}，{4，0，4，2，3}，
{5，4，0，2，0}，{0，2，2，0，1}，{3，3，0，1，0}｝，求这个图的最大生成树的权和为 14。

# 最小生成树

最小生成树其实是最小权重生成树的简称，一副连通加权无向图中一棵权值最小的生成树。

## Kruskal

(1)新建图 G

(2)把图 G 中所有的边按照权值从小到大排序。(一般使用优先队列)
(3)取出最小的边
(4)如果这条边连接的两个节点于图 G 中不在同一个连通分量中，则添加这条边到图 G 中.(使用并查集)
(5)重复 3，直至图 G 中所有的节点都在同一个连通分量中

```
public class KruskalMST {

    private Queue<Edge> mst = new Queue<>();
    private double weight;

    public KruskalMST(EdgeWeightedGraph g){
        MinPQ<Edge> minPQ = new MinPQ<>();
        for (Edge edge:g.edges()){
            minPQ.insert(edge);
        }
        UF uf =new UF(minPQ.size());
        while (!minPQ.isEmpty()){
            Edge edge = minPQ.delMin();
            int v = edge.either();
            int w = edge.other(v);
            if(!uf.connected(v,w)){
                uf.union(v,w);
                mst.enqueue(edge);
                //weight+=edge.weight();
            }
        }
    }
}


```

`Kruskal` 算法 基本上取决于优先队列的选择，以及并查集的实现。比较优的算法效率为`O(ElogE)`E 为图中的边数.对优先队列和并查集不了解的同学可以看看我这两篇文章，[查找算法之顺序、二分、二叉搜索树、红黑树](http://threezj.com/2016/03/20/%E6%9F%A5%E6%89%BE%E7%AE%97%E6%B3%95%E4%B9%8B%E9%A1%BA%E5%BA%8F%E3%80%81%E4%BA%8C%E5%88%86%E3%80%81%E4%BA%8C%E5%8F%89%E6%90%9C%E7%B4%A2%E6%A0%91%E3%80%81%E7%BA%A2%E9%BB%91%E6%A0%91/) 和 [并查集](http://threezj.com/2016/03/12/Union-Find%20/)

## Prim

Prim 算法，简单的说就是从一个点开始不断让树长大的过程,并且保持权值最小。
(1)生成图 G

(2)从 s 点开始
(3)把与 s 点相连的边都加入 edgeTo[],并且保存到这些点的距离 distTo[],且插入到优先队列
(4)出队一个点
(5)查找与这个点相连的点，若权值比 distTo[]中保存的值小则进更新，同时更新 distTo[]和优先队列
(6)重复 4
![](http://7xrsib.com1.z0.glb.clouddn.com/QQ%E6%88%AA%E5%9C%9620160424222602.jpg)

```
private Edge[] edgeTo;        // edgeTo[v] = shortest edge from tree vertex to non-tree vertex
    private double[] distTo;      // distTo[v] = weight of shortest such edge
    private boolean[] marked;     // marked[v] = true if v on tree, false otherwise
    private IndexMinPQ<Double> pq;

    public PrimMST(EdgeWeightedGraph G){
        edgeTo = new Edge[G.V()];
        distTo = new double[G.V()];
        marked = new boolean[G.V()];
        pq = new IndexMinPQ<Double>(G.V());
        for (int v = 0; v < G.V(); v++)
            distTo[v] = Double.POSITIVE_INFINITY;

        for (int v = 0; v < G.V(); v++)      // run from each vertex to find
            if (!marked[v]) prim(G, v);      // minimum spanning forest
    }

    private void prim(EdgeWeightedGraph g, int s) {
        distTo[s]=0;
        pq.insert(s,distTo[s]);
        while (!pq.isEmpty()){
            grow(g,pq.delMin());
        }
    }

    private void grow(EdgeWeightedGraph g, int v) {
        marked[v]=true;
        for (Edge e :g.adj(v)){
            int w = e.other(v);
            if(marked[w])   continue;
            if(distTo[w]>e.weight()){
                distTo[w]=e.weight();
                edgeTo[w] = e;
                if(pq.contains(w))
                    pq.decreaseKey(w,distTo[w]);
                else
                    pq.insert(w,distTo[w]);
            }
        }

    }

```

> Kruskal can have better performance if the edges can be sorted in linear time, or are already sorted。Prim’s better if the number of edges to vertices is high.

# Links

- [最小生成树,Prim 和 Kruskal 详细学习笔记](http://threezj.com/2016/04/24/%E6%9C%80%E5%B0%8F%E7%94%9F%E6%88%90%E6%A0%91,Prim%E5%92%8CKruskal%E8%AF%A6%E7%BB%86%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/)

    