import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Shell } from './components/Shell'
import { Home } from './Home'
import { VirtualEmailList } from './demos/VirtualEmailList/VirtualEmailList'
import { ProductCardGrid } from './demos/ProductCardGrid/ProductCardGrid'
import { SmartTruncation } from './demos/SmartTruncation/SmartTruncation'
import { TextFitting } from './demos/TextFitting/TextFitting'
import { TypographyLab } from './demos/TypographyLab/TypographyLab'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="virtual-email-list" element={<VirtualEmailList />} />
          <Route path="product-card-grid" element={<ProductCardGrid />} />
          <Route path="smart-truncation" element={<SmartTruncation />} />
          <Route path="text-fitting" element={<TextFitting />} />
          <Route path="typography-lab" element={<TypographyLab />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
