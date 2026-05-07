async function processarUsuario(usuario, banco, estatisticas) {
  const email = usuario?.email;
  const nome = usuario?.name?.first;
  const sobrenome = usuario?.name?.last;
  const genero = usuario?.gender;
  const dataNascimento = usuario?.dob?.date;
  const idade = usuario?.dob?.age;

  if (!email || !nome || !sobrenome || dataNascimento === undefined || idade === undefined) {
    estatisticas.erros.push({
      email: email || 'desconhecido',
      reason: 'Dados incompletos (email, nome ou data de nascimento ausente)',
      raw: JSON.stringify(usuario)
    });
    return;
  }

  if (idade < 18) {
    estatisticas.ignorados.push({
      email,
      name: `${nome} ${sobrenome}`,
      age: idade,
      reason: 'Menor de 18 anos'
    });
    return;
  }

  const existente = await banco.getUserByEmail(email);
  const dadosUsuario = {
    email,
    first_name: nome,
    last_name: sobrenome,
    gender: genero,
    dob: dataNascimento,
    age: idade
  };

  try {
    if (existente) {
      await banco.updateUser(dadosUsuario);
      estatisticas.atualizados++;
    } else {
      await banco.insertUser(dadosUsuario);
      estatisticas.adicionados++;
    }
    estatisticas.processados++;
  } catch (erroBanco) {
    estatisticas.erros.push({
      email,
      reason: `Erro no banco de dados: ${erroBanco.message}`
    });
  }
}

module.exports = { processarUsuario };
