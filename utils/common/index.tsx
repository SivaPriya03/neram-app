export function bindClassMethods(context: any, methods: string[]) {
  methods.forEach((methodName) => {
    const method: Function = context[methodName];
    context[methodName] = method.bind(context);
  });
}
