
---
title: Vue-CheatSheet
linktitle: Vue-CheatSheet
type: book
commentable: true
---

# Vuex

So What is Vuex? Vuex is a state management pattern + library for Vue.js applications. It serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion. Flux The whole basics of Vuex from Vue and Redux from React originated from Flux Architecture which is a simple Pattern that guides the development of complex UI Applications. Facebook came up with this pattern to solve a problem they had with their application. So now we know what Flux is and how Vuex comes to play a detailed explanation should come next or what do you think? Vuex Basic Concepts Vuex is a very impressive implementation of Flux pattern and a deep understanding of the following concepts is required. State: A State is simply the application data the components interacts with. The state object is a single object and it contains all your application level state and serves as the “single source of truth. It’s primary location is in the store. Getters: Vuex allows us to define “getters” in the store. You can think of them as computed properties for stores. Like computed properties, a getter result is cached based on its dependencies, and will only re-evaluate when some of its dependencies have changed. Easy way to make use of getters in Vue components is by leveraging the mapGetters helper function. Mutators: The only way of modifying a state of an application is by committing mutations. Mutators is similar to events in sense that it has it own string and handler component for committing mutations.Mutations are synchronous. mapMutations helper allows you use mutation conveniently in methods. Actions: Actions are similar to mutation only difference being action commits mutations and actions can contain arbitrary asynchronous operations. Actions are triggered with the store.dispatch method. mapAction helper also follows same rule as the helper for mutation. Modules : Building a large scale application could amount to a large amount of data in the store. Modules comes in as a rescue here serving as a container for all stores.

    