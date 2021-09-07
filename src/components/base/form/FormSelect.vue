<template>
  <div class="f-row">
    <label v-if="label">{{ label }}</label>
    <div class="input-wrapper">
      <select
        @change="handleChange"    
        v-bind="$attrs"
      >
        <option disabled :selected="!value">{{ placeholder }}</option>
        <option v-for="selectDropdownOption of options" :key="selectDropdownOption.id" :selected="value == selectDropdownOption">
          {{ selectDropdownOption.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "Maak een keuze",
    },
    options: {
      type: Array,
      required: true,
    },
    value: {
      required: true,
    },
    label: {
      type: String,
    },
  },
  emits: ["update:value"],
  setup: (props, { emit }) => {
    const handleChange = (e) => {
      const selectedOption = props.options.find(item => item.name === e.target.value);
      emit("update:value", selectedOption);
    }
    return {
      handleChange,
      type: props.value,
    };
  },
};
</script>

<style scoped>
	.f-row {
		display: flex;
		flex-direction: column;
		text-align: left;
		gap: 8px;
	}

	label {
		font-weight: 600;
		font-size: 14px;
		font-family: system-ui;
	}

	input,
	select {
		font-family: system-ui;
		padding: 19px 25px;
		font-size: 16px;
    width: 100%;
		border: 2px solid #eaeaea;
		background: white;
		border-radius: 10px;
		outline: 0;
		appearance: none;
		transition: border-color 0.2s ease;
		
		&[disabled] {
			background: #eaeaea;
		}
	}
	select {
		background-size: 20px;
		background-position: right 10px center;
		background-repeat: no-repeat;
		background-image: url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiIHdpZHRoPSIxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNDA4IDcwNHEwIDI2LTE5IDQ1bC00NDggNDQ4cS0xOSAxOS00NSAxOXQtNDUtMTlsLTQ0OC00NDhxLTE5LTE5LTE5LTQ1dDE5LTQ1IDQ1LTE5aDg5NnEyNiAwIDQ1IDE5dDE5IDQ1eiIvPjwvc3ZnPg==");
	}
	input:focus,
	select:focus {
		border-color: var(--color-secondary);
	}
	.errors {
		color: var(--color-error);
		line-height: 1.4;
	}
</style>
