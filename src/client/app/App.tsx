"use client"

import { useState } from "react"
import { ExternalLink, Server, Database, FileText, Zap } from "lucide-react"
import reactLogo from "../img/vite/react.svg"
import viteLogo from "../img/vite/vite.svg"
import isotipo from "../img/isotipo.svg"

function App() {
  const [count, setCount] = useState(0)

  const services = [
    {
      name: "Servidor",
      url: `${window.location.origin.replace(window.location.port, "5500")}`,
      icon: Server,
      status: "active",
    },
    {
      name: "GraphQL",
      url: `${window.location.origin.replace(window.location.port, "5500")}/graphql`,
      icon: Zap,
      status: "active",
    },
    {
      name: "Documentación",
      url: `${window.location.origin.replace(window.location.port, "5500")}/docs`,
      icon: FileText,
      status: "active",
    },
    {
      name: "DB Status",
      url: "#",
      icon: Database,
      status: "connected",
      statusText: "db conectada!",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-8 mb-8">
            <a href="https://vite.dev" target="_blank" className="group" rel="noreferrer">
              <img
                src={viteLogo || "/placeholder.svg"}
                className="h-24 p-4 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_#646cffaa] group-hover:scale-110"
                alt="Vite logo"
              />
            </a>
            <a href="https://react.dev" target="_blank" className="group" rel="noreferrer">
              <img
                src={reactLogo || "/placeholder.svg"}
                className="h-24 p-4 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_#61dafbaa] group-hover:scale-110 animate-spin-slow"
                alt="React logo"
              />
            </a>
            <a href="https://github.com/genarogg/my-server-fastify" target="_blank" className="group" rel="noreferrer">
              <img
                src={isotipo || "/placeholder.svg"}
                className="h-24 p-4 transition-all duration-300 group-hover:drop-shadow-[0_0_2em_#ffffff44] group-hover:scale-110"
                alt="logo genarogg"
              />
            </a>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Vite + React
          </h1>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              count is {count}
            </button>
            <p className="text-gray-300 mt-4">
              Edit <code className="bg-gray-800 px-2 py-1 rounded text-yellow-300">src/App.tsx</code> and save to test
              HMR
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Servicios Disponibles</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${service.status === "active" || service.status === "connected" ? "bg-green-400" : "bg-red-400"
                          }`}
                      />
                      <span className="text-sm text-gray-300">
                        {service.status === "connected" ? "conectada" : "activo"}
                      </span>
                    </div>
                  </div>

                  {service.statusText ? (
                    <p className="text-green-400 font-medium">{service.statusText}</p>
                  ) : (
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors duration-200 group-hover:translate-x-1"
                    >
                      <span className="font-mono text-sm break-all">{service.url}</span>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <p className="text-gray-400 text-center mt-12">Click on the Vite and React logos to learn more</p>
      </div>
    </div>
  )
}

export default App
