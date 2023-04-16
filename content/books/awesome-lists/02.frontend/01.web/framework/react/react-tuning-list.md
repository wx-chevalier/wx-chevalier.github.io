
---
title: React-Tuning-List
linktitle: React-Tuning-List
type: book
commentable: true
---

# React Production List

# Performance Optimization | 性能优化

- [2018-React Profiler](https://mp.weixin.qq.com/s/k-icCIEOHkGmV-cBJ0HUGQ): React 16.5 新增了对开发工具（DevTools）性能分析插件（profiler plugin）的支持。

- [2017-React Performance Fixes on Airbnb Listing Pages](https://parg.co/UpT): We have been hard at work migrating the airbnb.com core booking flow into a single-page server-rendered app using React Router and Hypernova.

- [React Office Site：Optimizing Performance](https://facebook.github.io/react/docs/optimizing-performance.html): For many applications, using React will lead to a fast user interface without doing much work to specifically optimize for performance. Nevertheless, there are several ways you can speed up your React application.

- [2017-Keep Your React Redux Healthy, Performance Optimization Story](https://parg.co/bCn): I am here to be honest about React optimization.

- [2017-React at Light Speed](https://blog.vixlet.com/react-at-light-speed-78cd172a6411): Lessons in optimizing performance at Vixlet

- [2017-45% Faster React Functional Components, Now](https://parg.co/bMa)

- [2017-Our Best Practices for Writing React Components](https://engineering.musefind.com/our-best-practices-for-writing-react-components-dec3eb5c3fc8#.3kin14vrf): When I first started writing React, I remember seeing many different approaches to writing components, varying greatly from tutorial to tutorial. Though the framework has matured considerably since then, there doesn’t seem to yet be a firm ‘right’ way of doing things.

- [2017-Memoize React components](https://github.com/planttheidea/moize)

- [2017-React at Light Speed](http://6me.us/dx5)

- [Should I use shouldComponentUpdate?](http://jamesknelson.com/should-i-use-shouldcomponentupdate/)

- [React 移动 web 极致优化](https://github.com/lcxfs1991/blog/issues/8?f=tt)

- [component-rendering-performance-in-react](https://medium.com/modus-create-front-end-development/component-rendering-performance-in-react-df859b474adc#.rjjvtwgs8)

- [React 应用优化：避免不必要的 render](http://www.broadview.com.cn/article/77)

- [React Rally: Animated — React Performance Toolbox](http://blog.vjeux.com/2015/javascript/react-rally-animated-react-performance-toolbox.html)

- [How to Benchmark React Components: The Quick and Dirty Guide](https://medium.com/code-life/how-to-benchmark-react-components-the-quick-and-dirty-guide-f595baf1014c#.w1t22c86k)

- [React.js pure render performance anti-pattern](https://medium.com/@esamatti/react-js-pure-render-performance-anti-pattern-fb88c101332f#.b9vwbt1jy)

- [A DEEP DIVE INTO REACT PERF DEBUGGING](http://benchling.engineering/deep-dive-react-perf-debugging/)

- [React at 60fps](https://medium.com/@okonetchnikov/react-at-60fps-4e36b8189a4c#.enqkaabwg)

- [React Performance Optimization](https://medium.com/@nesbtesh/react-performance-optimization-28ec5b61fff3#.lx9g6ewdg)

- [React Performance Optimization](http://6me.us/t73W9): Performance optimization can be a big pain with any language. Especially when you are optimizing your app and you have no idea what to optimize. React has some really nice tools to do this, I will be talking about one specifically that will make your life a lot better.
- [2017-React at Light Speed, Lessons in optimizing performance at Vixlet](https://blog.vixlet.com/react-at-light-speed-78cd172a6411): Here we will share some of the lessons we have learned along the way.

- [2017-Optimizing React Rendering](https://flexport.engineering/optimizing-react-rendering-part-1-9634469dca02)

- [2017-React, Inline Functions, and Performance](https://cdb.reacttraining.com/react-inline-functions-and-performance-bdff784f5578)

- [2017-reactopt ![code](https://ng-tech.icu/assets/code.svg)](https://github.com/reactopt/reactopt): A CLI React performance optimization tool that identifies potential unnecessary re-rendering.

- [2017-React is Slow, React is Fast: Optimizing React Apps in Practice](https://parg.co/UZq): If you care about performance, it's fairly easy to make any React application super fast. Here is how.

- [2017-React Performance Fixes on Airbnb Listing Pages](https://parg.co/UpT): There may be a lot of low-hanging fruit affecting performance in areas you might not track very closely but are still very important.

- [Creating more efficient React views with windowing](https://parg.co/UiL): In this presentation, the [bvaughn](https://github.com/bvaughn/) talks something abot performance, search, and app architecture in React development.

## Metrics

## Avoid Unnecessary Re-renders

- [High Performance React: 3 New Tools to Speed Up Your Apps](https://parg.co/b1v): In this post I’ll highlight tools and techniques for making React apps fast. Each section also has an interactive, and (hopefully) fun demo!

- [React PureComponent Pitfalls](https://parg.co/UXA): Unnecessary re-renders can slow down your app, especially when rendering large collections where updates to the collection occur frequently.

# Code Splitting & Components Decomposition | 代码分割与组件解耦

- [2017-Code Splitting in Create React App](http://serverless-stack.com/chapters/code-splitting-in-create-react-app.html): This chapter is an extra step that can help speed up the initial load time of your React app.

- [2017-https://parg.co/bXz](https://parg.co/bXz): Techniques for decomposing React components. React components have a lot of power and flexibility. With so many tools at your disposal, it is incredibly easy for components to grow over time, become bloated and do too much.

- [2017-Writing Clean and Concise React Components by Making Full Use of ES6/7 Features and the Container-Component Pattern](https://parg.co/b1B)

- [2018-Server Rendering, Code Splitting, and Lazy Loading with React Router v4](https://parg.co/UVJ): In this article, software engineers from Airbnb share practices in combing server rendering and code splitting.

- [Upgrading a create-react-app project to a SSR + code splitting setup](https://parg.co/Ukg): This is what we’ll cover: Server-side rendering, Code splitting with react-loadable, Code splitting on the server, Taking benefit of webpack’s chunkNames.

# Server Side Rendering | 服务端渲染

- [2017-Introducing Rapscallion ![code](https://ng-tech.icu/assets/code.svg)](http://formidable.com/blog/2017/introducing-rapscallion/): a new approach for server-side rendering React applications.

- [2017-Server-Side React Rendering](https://css-tricks.com/server-side-react-rendering/): In this tutorial, we'll take you through a server side rendering example step-by-step. including working around a common roadblock for React apps that talk to APIs.

- [React 同构技术](https://zhuanlan.zhihu.com/p/21492780)

- [React on the Server for Beginners: Build a Universal React and Node App](https://scotch.io/tutorials/react-on-the-server-for-beginners-build-a-universal-react-and-node-app)

- [Redux 官方文档 ServerSideRendering](http://redux.js.org/docs/recipes/ServerRendering.html)

- [玩转 React 服务端渲染](https://blog.coding.net/blog/React-server-rendering)

- [isomorphic-redux-app](https://github.com/caljrimmer/isomorphic-redux-app)

- [Client-side vs. server-side rendering: why it’s not all black and white.](https://medium.freecodecamp.com/what-exactly-is-client-side-rendering-and-hows-it-different-from-server-side-rendering-bd5c786b340d#.n4zils8st): Since the dawn of time, the conventional method for getting your HTML up onto a screen was by using server-side rendering. It was the only way. You loaded up your .html pages on your server, then your server went and turned them into useful documents on your users’ browsers.

- [Introducing Rapscallion](http://formidable.com/blog/2017/introducing-rapscallion/): a new approach for server-side rendering React applications.

- [2017-Scaling React Server-Side Rendering](http://arkwright.github.io/scaling-react-server-side-rendering.html): Some of the insights here are React-specific, but many are simply generic scalability challenges, or simple mistakes that were made.

- [Streaming Server-Side Rendering and Caching at Spectrum](https://zeit.co/blog/streaming-server-rendering-at-spectrum): In this guest post he describes the journey to high performance server-rendering of their React application with streaming responses and distributed caching.

# Monitor & Report | 监控与回报

# Preact

- [The Inner Workings Of Virtual DOM](https://medium.com/@rajaraodv/the-inner-workings-of-virtual-dom-666ee7ad47cf#.or5425hja)

- [Webpack2 boilerplate for building SPA / PWA / offline front-end apps with Preact](https://github.com/lukeed/preact-starter)

- [司徒正美 preact 源码学习系列文章](https://segmentfault.com/a/1190000010336457)

    