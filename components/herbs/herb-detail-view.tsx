/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

export function HerbDetailView({
  id,
  initialData,
}: {
  id: string
  initialData: any
}) {
  // const { data: plant } = useQuery({
  //   queryKey: herbKeys.detail(id),
  //   queryFn: () => herbService.getById(id),
  //   initialData, // Aquí hidratamos con los datos del servidor
  // })
  // console.log('para el componente client', id)
  return (
    <div>
      <h1>{initialData.id}</h1>
      {/* Resto de tu UI */}
    </div>
  )
}
