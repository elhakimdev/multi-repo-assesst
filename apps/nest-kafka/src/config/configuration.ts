import kafkaConfiguration from "./kafka-configuration";

export default () => ({
  kafka: {
    ...kafkaConfiguration()
  }
})