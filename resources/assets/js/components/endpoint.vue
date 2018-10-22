<template>
  <div>
    <section v-for="(item, index) in data" :key="index" :id="generateCssId(item.name)" style="width: 100%;">
      <v-expansion-panel>
        <v-expansion-panel-content>
          <div slot="header">
            <h2>
              <v-chip :color="getColor(item.request.method)" text-color="white" label>{{ item.request.method }} <span>{{ item.request.url.raw }}</span></v-chip>
              <small class="subheading">{{ item.name }}</small>
            </h2>
          </div>
          <v-card>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs12 style="overflow-x:auto;">
                  <h3 class="mb-3">Decription: </h3>
                  <VueMarkdown :source="item.request.description"/>
                  <!-- <h3 class="mb-3">Header</h3>
                  <table v-if="item.request.header" class="table is-fullwidth">
                    <tr v-if="item.request.auth">
                      <th width="20%">Authorization</th>
                      <td width="80%">Bearer {{ item.request.auth.bearer[0].value }}</td>
                    </tr>
                    <tr v-for="(header, i) in item.request.header" :key="i">
                      <th>{{ header.key }}</th>
                      <td>{{ header.value }}</td>
                    </tr>
                  </table> -->
                </v-flex>
                <v-flex v-if="item.request.body && (item.request.body.raw || item.request.body.formdata)" xs12 style="overflow-x:auto;" class="mt-4">
                  <h3 class="mb-3">Request Body: </h3>
                  <div v-if="item.request.body.raw">
                    <pre><code>{{ parseJson(item.request.body.raw) }}</code></pre>
                  </div>
                  <div v-else-if="item.request.body.formdata">
                    <table class="table is-fullwidth">
                      <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Description</th>
                      </tr>
                      <tr v-for="(body, i) in item.request.body.formdata" :key="i">
                        <td>{{ body.key }}</td>
                        <td>{{ body.value }}</td>
                        <td>{{ body.description }}</td>
                      </tr>
                    </table>
                  </div>
                </v-flex>
                <v-flex xs12 style="overflow-x:auto;" class="mt-4">
                  <h3 class="mb-3">Response: </h3>
                  <pre><code>{{ getResponse(item.response) }}</code></pre>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </section>
  </div>
</template>

<script>
import changeCase from "change-case"
import VueMarkdown from "vue-markdown"

export default {
  components: { VueMarkdown },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    generateCssId(text) {
      return changeCase.snakeCase(text).toString()
    },
    getColor(method) {
      switch (method) {
        case "GET":
          return "primary"
        case "POST":
          return "success"
        case "PUT":
          return "orange"
        case "DELETE":
          return "red"

        default:
          return "primary"
      }
    },
    parseJson(str) {
      try {
        return JSON.parse(str)
      } catch (e) {
        return str
      }
    },
    getResponse(response) {
      if (response && response[0].body) {
        return this.parseJson(response[0].body)
      } else if (response && response[1].body) {
        return this.parseJson(response[1].body)
      } else if (response && response[2].body) {
        return this.parseJson(response[2].body)
      } else {
        return ""
      }
    }
  }
}
</script>

<style scoped>
</style>
