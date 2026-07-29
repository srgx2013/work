// App — top-level wizard step router.
// Reads currentStep from the Zustand wizard slice and renders the matching
// step component inside WizardLayout.

import { WizardLayout } from '@/ui/layouts/WizardLayout'
import { useAppStore } from '@/application/store/index'
import { PortadaStep } from '@/ui/steps/PortadaStep'
import { HogaresViviendaStep } from '@/ui/steps/HogaresViviendaStep'
import { Menores12Step } from '@/ui/steps/Menores12Step'
import { Personas12PlusStep } from '@/ui/steps/Personas12PlusStep'
import { NegociosStep } from '@/ui/steps/NegociosStep'
import { GastosHogarStep } from '@/ui/steps/GastosHogarStep'
import { GastosDiariosStep } from '@/ui/steps/GastosDiariosStep'
import { ReporteStep } from '@/ui/steps/ReporteStep'

export function App() {
  const currentStep = useAppStore((s) => s.currentStep)

  return (
    <WizardLayout>
      {currentStep === 1 && <PortadaStep />}
      {currentStep === 2 && <HogaresViviendaStep />}
      {currentStep === 3 && <Menores12Step />}
      {currentStep === 4 && <Personas12PlusStep />}
      {currentStep === 5 && <NegociosStep />}
      {currentStep === 6 && <GastosHogarStep />}
      {currentStep === 7 && <GastosDiariosStep />}
      {currentStep === 8 && <ReporteStep />}
    </WizardLayout>
  )
}