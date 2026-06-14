import { apiGet, apiPost } from "@/lib/api"

export interface Attribute {
  id: string
  code: string
  name: string
  type: "text" | "number" | "boolean" | "select"
  options?: string[]
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface AttributeDefinition {
  id: string
  attributeName: string
  dataType: string
  options?: string[]
  isMandatory?: boolean
  status?: boolean
  createdAt?: string
  updatedAt?: string
}

function mapType(dataType: string): Attribute["type"] {
  const dt = dataType.toLowerCase()
  if (dt === "number" || dt === "numeric") return "number"
  if (dt === "boolean" || dt === "bool") return "boolean"
  if (dt === "select" || dt === "dropdown") return "select"
  return "text"
}

function mapAttribute(a: AttributeDefinition): Attribute {
  return {
    id: a.id,
    code: a.attributeName.toLowerCase().replace(/\s+/g, "_"),
    name: a.attributeName,
    type: mapType(a.dataType),
    options: a.options,
    status: a.status ? "ACTIVE" : "INACTIVE",
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }
}

export const attributesApi = {
  list: async (): Promise<Attribute[]> => {
    const res = await apiGet<{ items: AttributeDefinition[] }>("/attributes/definitions")
    const items = Array.isArray(res) ? res : (res as { items?: AttributeDefinition[] }).items ?? []
    return items.map(mapAttribute)
  },
  create: async (payload: Partial<Attribute>): Promise<Attribute> => {
    const dataTypeMap: Record<string, string> = {
      text: "TEXT",
      number: "NUMBER",
      boolean: "BOOLEAN",
      select: "DROPDOWN",
    }
    const body = {
      attributeCode: payload.code ?? payload.name?.toLowerCase().replace(/\s+/g, "_") ?? "",
      attributeName: payload.name ?? payload.code ?? "",
      dataType: dataTypeMap[payload.type ?? "text"] ?? "TEXT",
      mandatory: false,
    }
    const data = await apiPost<AttributeDefinition>("/attributes/definitions", body)
    return mapAttribute(data)
  },
}
