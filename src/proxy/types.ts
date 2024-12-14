import { SimpleSchema, AIFunctionOptions } from '@/types'

export type AIFunction<T extends SimpleSchema> = (input: any) => Promise<any>
export type AIFunctionCreator = <T extends SimpleSchema>(schema: T, options?: AIFunctionOptions) => AIFunction<T>
export type AIProxyHandler = { [key: string]: AIFunctionCreator }