import os
from ai_builder import InfrastructureGenerator, CodeQuantumEngine, AutoDevOpsPipeline

def hyperbuild():
    infra = InfrastructureGenerator(
        providers=["aws", "linode"],
        specs="specs/pharaoh-v3.json"
    ).deploy()

    code = CodeQuantumEngine(
        frameworks=["next15", "fastify", "trpc"],
        requirements="specs/pharaoh-v3.json",
        optimization_level="max"
    ).build()

    AutoDevOpsPipeline(
        infra_state=infra,
        codebase=code,
        monitoring="sentinel-mode"
    ).execute()

if __name__ == "__main__":
    hyperbuild()
