<template>
  <div>
    <section v-for="(endpoints, index) in data" :key="index" :id="generateCssId(endpoints.name)" class="mt-2" style="width: 100%;">
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header"><h1>{{ endpoints.name }}</h1></div>
          <v-card>
            <v-card-text>
              <VueMarkdown v-if="endpoints.description" :source="endpoints.description"/>
              <endpoint :data="endpoints.item"/>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </section>
  </div>
</template>

<script>
import changeCase from "change-case"
import endpoint from "./endpoint"
import VueMarkdown from "vue-markdown"

export default {
  components: { endpoint, VueMarkdown },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    generateCssId(text) {
      return changeCase.snakeCase(text).toString()
    }
  }
}
</script>

<style scoped>
</style>
