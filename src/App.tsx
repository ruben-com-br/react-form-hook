import { useState } from 'react'
import './styles/global.css'
// lib react-hook-form para forms
import { useFieldArray, useForm } from 'react-hook-form'
// lib para validacao
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

/**
 * Todo 
 * [ ] validacao / transformacao 
 * [ ] Field Arrays 
 * [ ] Upload de arquivos 
 * [ ] Composition Pattern* 
 */
const createUserForSchema = z.object({
  name: z.string()
    .nonempty('O nome é obrigatório')
    .transform(name => name.trim().split(' ').map(word => {
      return word[0].toLocaleUpperCase().concat(word.substring(1))
    }).join(' ')),
  email: z.string()
    .nonempty('O email é obrigatório')
    .email('Formato do e-mail inválido'),
  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório'),
    knowledge: z.coerce.number().min(1).max(100),
  })).min(2,'Insira pelo menos 2 tecnologias')
})

type CreateUserForSchema = z.infer<typeof createUserForSchema>


function App() {
  //hook que devolve algumas coisas
  const [output, setOutput] = useState('')
  const {
    register, // registra o campo a ser submetido
    handleSubmit, // pega a função do submit
    control,
    formState: { errors } } // pega os erros
    = useForm<CreateUserForSchema>({
      resolver: zodResolver(createUserForSchema),
    })

  // fields -> campos
  // add um novo elemento
  // remove remover elemento
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs'
  })


  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }

  function createUser(data: any) {
    console.log(errors)
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className='flex flex-col gap-4 w-full max-w-xs'
      >
        <div className='flex flex-col gap-1'>
          <label htmlFor="name">Nome</label>
          <input
            type="name"
            className="border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            {...register('name')}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            //name="email" -> não precisa esta embutindo do register
            // esta
            // o register vai REGISTRAR no submit o campo
            {...register('email')}

          //mostrar erro
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className="border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
            {...register('password')}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button type='button' onClick={addNewTech} className="text-emerald-500 text-sm">
              Adicionar
            </button>
          </label>
          {fields.map((field, index) => {
            return (
              <div className="flex gap-2" key={field.id}>
                <div className="flex-1 flex flex-col gap-1">

                  <input
                    type="text"
                    className="border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && <span className="text-red-500 text-sm">{errors.techs?.[index]?.title?.message}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    className="w-16 border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-800 text-white"
                    {...register(`techs.${index}.knowledge`)}
                    />
                </div>
                    {errors.techs?.[index]?.knowledge && <span className="text-red-500 text-sm">{errors.techs?.[index]?.knowledge?.message}</span>}
              </div>
            )
          })}
          {errors.techs && <span className="text-red-500 text-sm">{errors.techs.message}</span>}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald"
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  )
}

export default App;